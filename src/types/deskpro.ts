export interface Settings{
    client_id?: string
    use_deskpro_saas?: boolean,
}

export type ContextData = {
    ticket?: {
      id: string,
      subject: string,
      permalinkUrl: string,
      primaryUser: {
        id: string,
        email: string
        displayName: string
        firstName: string
        lastName: string
      }
    },
    user?: {
      id: string
      isAgent: boolean
      firstName: string
      lastName: string
      name: string
      titlePrefix: string
      primaryEmail: string
      emails: string[]
    }
  };