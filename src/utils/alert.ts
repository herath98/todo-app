import { toast } from 'sonner';

const alert = {
  success: (msg: string) => toast.success(msg),
  error: (msg: string) => toast.error(msg),
  warn: (msg: string) => toast.warning(msg),
  info: (msg: string) => toast.info(msg)
};

export default alert;