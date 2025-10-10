export type ServiceItem = {
  id: string;
  name: string;
  duration: number;     
  price?: number;       
  category?: string;    
};

export type AppointmentDraft = {
  services: ServiceItem[];
//   client: { id?: string; name?: string; phone?: string; email?: string } | null;
client: ClientMini | null;
date: Date | null;
  start?: string | null;    
};

export type ClientMini = {
  id?: string;         
  name: string;
  phone?: string;
  email?: string;
};
