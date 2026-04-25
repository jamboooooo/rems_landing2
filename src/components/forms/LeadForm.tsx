import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createFormSchema, createZodResolver } from '@/lib/forms';

const leadSchema = createFormSchema(
  z.object({
    name: z.string().min(2, 'Введите имя'),
    phone: z.string().min(6, 'Введите телефон'),
  }),
);

export function LeadForm() {
  const form = useForm<z.infer<typeof leadSchema>>({
    resolver: createZodResolver(leadSchema),
    defaultValues: {
      name: '',
      phone: '',
    },
  });

  const onSubmit = form.handleSubmit(() => {
    // Business logic will be implemented in the feature stage.
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-lg border p-4">
      <Input placeholder="Имя" {...form.register('name')} />
      <Input placeholder="Телефон" {...form.register('phone')} />
      <Button type="submit">Отправить</Button>
    </form>
  );
}
