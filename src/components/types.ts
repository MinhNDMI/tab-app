export interface Campaign {
  information: {
      name: string;
      describe?: string;
  };
  subCampaigns: SubCampaign[];
}

export interface SubCampaign {
  name: string;
  id: string;
  status: boolean;
  ads: Ad[];
}

export interface Ad {
  id: string;
  name: string;
  quantity: number;
}