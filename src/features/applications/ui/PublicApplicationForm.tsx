import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createPublicApplication } from '@/features/applications/api/public-applications.api';
import { createFormSchema, createZodResolver } from '@/lib/forms';
import { getStoredReferralId, referralIdToAuthorId } from '@/shared/lib/referral';

const applicationSchema = createFormSchema(
  z.object({
    clientFullName: z.string().min(2, 'Введите имя'),
    clientPhoneNumber: z.string().min(6, 'Введите телефон'),
    comment: z.string().optional(),
  }),
);

type PublicApplicationFormProps = {
  propertyId: string;
};

export function PublicApplicationForm({ propertyId }: PublicApplicationFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof applicationSchema>>({
    resolver: createZodResolver(applicationSchema),
    defaultValues: {
      clientFullName: '',
      clientPhoneNumber: '',
      comment: '',
    },
  });

  const submitApplication = form.handleSubmit(async (values) => {
    try {
      setSubmitError(null);
      const referralId = getStoredReferralId();
      await createPublicApplication({
        clientFullName: values.clientFullName.trim(),
        clientPhoneNumber: values.clientPhoneNumber.trim(),
        comment: values.comment?.trim() || undefined,
        propertyIds: [propertyId],
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
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)]/60 p-4 text-sm">
        Спасибо! Заявка отправлена, менеджер свяжется с вами в ближайшее время.
      </div>
    );
  }

  return (
    <div
      className="grid gap-3"
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          void submitApplication();
        }
      }}
    >
      <Input placeholder="ФИО" {...form.register('clientFullName')} />
      <Input placeholder="Телефон" {...form.register('clientPhoneNumber')} />
      <Input placeholder="Комментарий" {...form.register('comment')} />
      {submitError ? <p className="text-sm text-red-500">{submitError}</p> : null}
      <Button
        type="button"
        size="lg"
        disabled={form.formState.isSubmitting}
        onClick={() => void submitApplication()}
      >
        {form.formState.isSubmitting ? 'Отправка...' : 'Оставить заявку'}
      </Button>
    </div>
  );
}
