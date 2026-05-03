import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createPublicApplication } from '@/features/applications/api/public-applications.api';
import { createFormSchema, createZodResolver } from '@/lib/forms';
import { getStoredReferralId, referralIdToAuthorId } from '@/shared/lib/referral';

const leadSchema = createFormSchema(
  z.object({
    name: z.string().min(2, 'Введите имя'),
    phone: z.string().min(6, 'Введите телефон'),
  }),
);

export function LeadForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<z.infer<typeof leadSchema>>({
    resolver: createZodResolver(leadSchema),
    defaultValues: {
      name: '',
      phone: '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      setSubmitError(null);
      const referralId = getStoredReferralId();
      await createPublicApplication({
        clientFullName: values.name.trim(),
        clientPhoneNumber: values.phone.trim(),
        source: 'step_dream',
        authorId: referralIdToAuthorId(referralId),
      });
      setSubmitted(true);
      form.reset();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Не удалось отправить заявку');
    }
  });

  if (submitted) {
    return (
      <div className="p-1 text-sm text-[var(--color-foreground)]">
        Спасибо! Мы получили заявку и скоро свяжемся с вами.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid h-full content-center gap-3">
      <Input placeholder="ФИО" {...form.register('name')} />
      <Input placeholder="Телефон" {...form.register('phone')} />
      {submitError ? <p className="text-sm text-red-500">{submitError}</p> : null}
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? 'Отправка...' : 'Оставить заявку'}
      </Button>
    </form>
  );
}
