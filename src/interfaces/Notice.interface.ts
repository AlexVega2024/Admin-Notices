
export interface INotice {
  id_category?: number;
  id_notice: number;
  img_card: string;
  img_banner?: string;
  title: string;
  description: string;
  date_time?: string;
  state_notice?: number;
  galeryImages?: IGallery[];
}

export interface IGallery {
  id_notice: number;
  id_gallery: number;
  name_image: string | File;
  state_image: number;
}

export interface ICategory {
  id_category: number;
  name: string;
  noticies?: []
  state_categ: number;
}
