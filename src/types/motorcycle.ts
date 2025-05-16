
export interface Motorcycle {
  id: string;
  user_id: string;
  nickname: string;
  make: string;
  model: string;
  year: number;
  odometer_miles: number;
  insurance_doc_url: string | null;
  registration_doc_url: string | null;
  image_url: string | null;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface MotorcycleFormData {
  nickname: string;
  make: string;
  model: string;
  year: number;
  odometer_miles: number;
  image_file?: File | null;
  insurance_doc_file?: File | null;
  registration_doc_file?: File | null;
}
