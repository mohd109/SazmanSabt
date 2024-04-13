export interface IProfileDetails {
  avatar: string;
  // country: string;
  // language: string;
  // timeZone: string;
  // currency: string;
  // communications: {
  //   email: boolean;
  //   phone: boolean;
  // };
  two_steps: boolean;
  user_name: string,
  phone_number: string,
  email: string,
  // image: string,
  // id_card: string,
  // gender: string,
  // birth: string,
  // post_code: string,
  // addr: string,
  // city: string,
  // bank_account: string,
  // active: string,
  // id_code: string,
  // notifications: string,
  // favorites: string,
  // position: string,
  // role: string,
  // last_login: string,
  // joined_day: string,
  // online: boolean,
  name: string,
  // access_level: number,
  // initial_label: string,
  // initial_state: string
}

export interface IUpdateEmail {
  newEmail: string;
  confirmPassword: string;
}

export interface IUpdatePassword {
  currentPassword: string;
  newPassword: string;
  passwordConfirmation: string;
}

export interface IConnectedAccounts {
  google: boolean;
  github: boolean;
  stack: boolean;
}

export interface IEmailPreferences {
  successfulPayments: boolean;
  payouts: boolean;
  freeCollections: boolean;
  customerPaymentDispute: boolean;
  refundAlert: boolean;
  invoicePayments: boolean;
  webhookAPIEndpoints: boolean;
}

export interface INotifications {
  notifications: {
    email: boolean;
    phone: boolean;
  };
  billingUpdates: {
    email: boolean;
    phone: boolean;
  };
  newTeamMembers: {
    email: boolean;
    phone: boolean;
  };
  completeProjects: {
    email: boolean;
    phone: boolean;
  };
  newsletters: {
    email: boolean;
    phone: boolean;
  };
}

export interface IDeactivateAccount {
  confirm: boolean;
}

export const profileDetailsInitValues: IProfileDetails = {
  avatar: "blank",
  name: "",
  user_name: "",
  phone_number: "",
  email: "",
  // communications: {
  //   email: false,
  //   phone: false,
  // },
  two_steps: false,
};

export const updateEmail: IUpdateEmail = {
  newEmail: "xyz@ut.ac.ir",
  confirmPassword: "",
};

export const updatePassword: IUpdatePassword = {
  currentPassword: "",
  newPassword: "",
  passwordConfirmation: "",
};

export const connectedAccounts: IConnectedAccounts = {
  google: true,
  github: true,
  stack: false,
};

export const emailPreferences: IEmailPreferences = {
  successfulPayments: false,
  payouts: true,
  freeCollections: false,
  customerPaymentDispute: true,
  refundAlert: false,
  invoicePayments: true,
  webhookAPIEndpoints: false,
};

export const notifications: INotifications = {
  notifications: {
    email: true,
    phone: true,
  },
  billingUpdates: {
    email: true,
    phone: true,
  },
  newTeamMembers: {
    email: true,
    phone: false,
  },
  completeProjects: {
    email: false,
    phone: true,
  },
  newsletters: {
    email: false,
    phone: false,
  },
};

export const deactivateAccount: IDeactivateAccount = {
  confirm: false,
};
