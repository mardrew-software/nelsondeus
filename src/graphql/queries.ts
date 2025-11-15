import { gql } from 'graphql-request';

export const GET_EXPLORER_DATA = gql`
query GetExplorer {
  settings(first: 1) {
    artistName
    socials {
      id
      platform
      url
      icon {
        url
      }
    }
  }
  folders(first: 1000) {
    id
    name
    slug
    icon {
      url
    }
    parent {
        id
    }
    subfolders {
      ... on Folder {
        id
        name
        slug
      }
    }
    files {
      ... on File {
        id
        name
        showName
        slug
        date
        type
        autoplay
        icon {
         url
        }
        description {
          html
        }
        media {
          id
          url
          width
          height
        }
        folder {
          id
          name
        }
      }
    }
  }
  files(first: 1000) {
    id
    name
    showName
    slug
    type
    date
    autoplay
    description {
      html
    }
    icon {
      url
    }
    media {
      id
      url
      width
      height
    }
    folder {
      id
    }
  }
}
`;