/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTodos } from '../../hooks/todos/useTodos';
import { ENDPOINTS } from '../../lib/constants';
import { createTodoSchema, type CreateTodoFormValues } from '../../lib/validations';
import type { Todo } from '../../types/todo.types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Checkbox } from '../../components/ui/checkbox';
import { Card, CardContent } from '../../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter } from
'../../components/ui/dialog';
import { ConfirmDialog } from '../../components/shared/ConfirmDialog';
import { EmptyState } from '../../components/shared/EmptyState';
import {
  PlusIcon,
  Trash2Icon,
  PencilIcon,
  CheckSquareIcon,
  Loader2Icon } from
'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
export function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Todo | null>(null);
  const navigate = useNavigate();
  const { getTodos, loading, createTodo, creating, toggleTodo, deleteTodo, deleting } = useTodos();

  const {
    register: registerTodo,
    handleSubmit,
    reset: resetForm,
    formState: { errors: todoErrors },
  } = useForm<CreateTodoFormValues>({
    resolver: yupResolver(createTodoSchema),
    mode: 'onTouched',
  });

  const loadTodos = async () => {
    const res = await getTodos({ data: { page: 1, limit: 50 } });
    if (res?.data) setTodos((res.data as { todos?: Todo[] })?.todos || []);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleToggle = async (todo: Todo) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...t, isDone: !t.isDone } : t))
    );
    await toggleTodo({ endpoint: ENDPOINTS.TODO_TOGGLE(todo.id) });
  };

  const handleCreate = async (values: CreateTodoFormValues) => {
    const res = await createTodo({ data: values });
    if (res?.success || res?.status) {
      setCreateOpen(false);
      resetForm();
      loadTodos();
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await deleteTodo({ endpoint: ENDPOINTS.TODO_BY_ID(deleteTarget.id) });
    if (res?.success || res?.status) {
      setTodos((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };
  const pending = todos.filter((t) => !t.isDone);
  const completed = todos.filter((t) => t.isDone);
  return (
    <div className="space-y-6 ">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Todos</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {todos.length} total · {pending.length} pending
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <PlusIcon className="w-4 h-4" />
          New Todo
        </Button>
      </div>

      {loading &&
      <div className="flex items-center justify-center py-12">
          <Loader2Icon className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      }

      {!loading && todos.length === 0 &&
      <EmptyState
        icon={<CheckSquareIcon className="w-6 h-6 text-muted-foreground" />}
        title="No todos yet"
        description="Create your first todo to get started."
        action={
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
              <PlusIcon className="w-4 h-4" />
              New Todo
            </Button>
        } />

      }

      {!loading && pending.length > 0 &&
      <div className="space-y-2">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Pending ({pending.length})
          </h2>
          <div className='md:grid md:grid-cols-2 xl:grid-cols-3 gap-4'>
          {pending.map((todo) =>
        <TodoCard
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onDelete={setDeleteTarget}
          onView={() => navigate(`/todos/${todo.id}`)} />

        )}
        </div>
        </div>
      }

      {!loading && completed.length > 0 &&
      <div className="space-y-2 ">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Completed ({completed.length})
          </h2>
          <div className='md:grid md:grid-cols-2 xl:grid-cols-3 gap-4'>
          {completed.map((todo) =>
        <TodoCard
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onDelete={setDeleteTarget}
          onView={() => navigate(`/todos/${todo.id}`)} />

        )}
        </div>
        </div>
      }

      <Dialog open={createOpen} onOpenChange={(open) => { setCreateOpen(open); if (!open) resetForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Todo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleCreate)} noValidate className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="What needs to be done?"
                aria-invalid={!!todoErrors.title}
                {...registerTodo('title')}
              />
              {todoErrors.title && (
                <p className="text-xs text-destructive" role="alert">
                  {todoErrors.title.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Add more details..."
                rows={3}
                aria-invalid={!!todoErrors.description}
                {...registerTodo('description')}
              />
              {todoErrors.description && (
                <p className="text-xs text-destructive" role="alert">
                  {todoErrors.description.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}>

                Cancel
              </Button>
              <Button type="submit" disabled={creating}>
                {creating ? 'Creating...' : 'Create Todo'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Todo"
        description={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        loading={deleting} />

    </div>);

}
interface TodoCardProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onView: () => void;
}
function TodoCard({ todo, onToggle, onDelete, onView }: TodoCardProps) {
  return (
    <Card className="group">
      <CardContent className="flex items-start gap-3 py-3 px-4">
        <Checkbox
          checked={todo.isDone}
          onCheckedChange={() => onToggle(todo)}
          className="mt-0.5 flex-shrink-0"
          aria-label={`Mark "${todo.title}" as ${todo.isDone ? 'incomplete' : 'complete'}`} />

        <div className="flex-1 min-w-0 cursor-pointer" onClick={onView}>
          <p
            className={cn(
              'text-sm font-medium text-foreground truncate',
              todo.isDone && 'line-through text-muted-foreground'
            )}>

            {todo.title}
          </p>
          {todo.description &&
          <p className="text-xs text-muted-foreground truncate mt-0.5">
              {todo.description}
            </p>
          }
        </div>
        <div className="flex items-center gap-1  transition-opacity">
          <Button
           
            size="icon"
            className="h-7 w-7 !bg-gray-950"
            onClick={onView}
            aria-label="View todo">

            <PencilIcon className="w-3.5 h-3.5 " />
          </Button>
          <Button
           
            size="icon"
            className="h-7 w-7 bg-red-500/10 text-destructive hover:text-destructive"
            onClick={() => onDelete(todo)}
            aria-label="Delete todo">

            <Trash2Icon className="w-3.5 h-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>);

}