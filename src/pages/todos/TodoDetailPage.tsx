/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTodoDetail } from '../../hooks/todos/useTodoDetail';
import { ENDPOINTS } from '../../lib/constants';
import { updateTodoSchema, type UpdateTodoFormValues } from '../../lib/validations';
import type { Todo } from '../../types/todo.types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Checkbox } from '../../components/ui/checkbox';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle } from
'../../components/ui/card';
import { ConfirmDialog } from '../../components/shared/ConfirmDialog';
import {
  ArrowLeftIcon,
  Trash2Icon,
  SaveIcon,
  Loader2Icon,
  CalendarIcon } from
'lucide-react';
import { cn } from '../../lib/utils';
export function TodoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { getTodo, loading, updateTodo, saving, toggleTodo, toggling, deleteTodo, deleting } =
    useTodoDetail(id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateTodoFormValues>({
    resolver: yupResolver(updateTodoSchema),
    mode: 'onTouched',
  });

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const res = await getTodo();
      if (res?.data) {
        const t = (res.data as { todo?: Todo })?.todo || (res.data as Todo);
        setTodo(t);
        reset({ title: t.title, description: t.description || '' });
      }
    };
    load();
  }, []);

  const handleSave = async (values: UpdateTodoFormValues) => {
    const res = await updateTodo({ data: values });
    if (res?.success || res?.status) {
      const u = (res.data as { todo?: Todo })?.todo;
      if (u) {
        setTodo(u);
        reset({ title: u.title, description: u.description || '' });
      }
    }
  };
  const handleToggle = async () => {
    if (!todo || !id) return;
    setTodo((p) => p && { ...p, isDone: !p.isDone });
    await toggleTodo({ endpoint: ENDPOINTS.TODO_TOGGLE(id) });
  };
  const handleDelete = async () => {
    if (!id) return;
    const res = await deleteTodo({ endpoint: ENDPOINTS.TODO_BY_ID(id) });
    if (res?.success || res?.status) navigate('/todos');
  };
  const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  if (loading)
  return (
    <div className="flex items-center justify-center py-24">
        <Loader2Icon className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>);

  if (!todo)
  return (
    <div className="text-center py-24">
        <p className="text-muted-foreground">Todo not found.</p>
        <Button variant="link" onClick={() => navigate('/todos')}>
          Back to todos
        </Button>
      </div>);

  return (
    <div className="max-w-2xl space-y-6">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
        onClick={() => navigate('/todos')}>

        <ArrowLeftIcon className="w-4 h-4" />
        Back to Todos
      </Button>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={todo.isDone}
              onCheckedChange={handleToggle}
              disabled={toggling}
              className="mt-1" />

            <CardTitle
              className={cn(
                'text-xl font-semibold text-foreground',
                todo.isDone && 'line-through text-muted-foreground'
              )}>

              {todo.title}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive flex-shrink-0"
            onClick={() => setDeleteOpen(true)}>

            <Trash2Icon className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              Created {formatDate(todo.createdAt)}
            </span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Edit Todo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(handleSave)} noValidate className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              aria-invalid={!!errors.title}
              {...register('title')}
            />
            {errors.title && (
              <p className="text-xs text-destructive" role="alert">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              aria-invalid={!!errors.description}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-xs text-destructive" role="alert">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={saving || !isDirty}
              className="gap-2">
              <SaveIcon className="w-4 h-4" />
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
          </form>
        </CardContent>
      </Card>
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Todo"
        description="Are you sure you want to delete this todo? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        loading={deleting} />

    </div>);

}