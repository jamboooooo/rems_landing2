import { postRequest } from '@/shared/api/api';

export type PublicApplicationPayload = {
  clientFullName: string;
  clientPhoneNumber: string;
  propertyIds?: string[];
  comment?: string;
  source?: 'step_dream' | 'step_alliance';
  authorId?: number;
};

type PublicApplicationResponse = {
  message: string;
  id: string;
};

export async function createPublicApplication(payload: PublicApplicationPayload) {
  return postRequest<PublicApplicationResponse, PublicApplicationPayload>(
    '/applications/public',
    payload,
  );
}
