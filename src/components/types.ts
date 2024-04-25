export interface Campaign {
  information: {
      name: string;
      describe?: string;
  };
  subCampaigns: SubCampaign[];
}

export interface SubCampaign {
  name: string;
  status: boolean;
  ads: Ad[];
}

export interface Ad {
  name: string;
  quantity: number;
}