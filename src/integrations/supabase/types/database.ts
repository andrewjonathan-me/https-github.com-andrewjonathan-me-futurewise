import { Json } from './json';
import { ContactsTable } from './contacts';
import { ForumAttachmentsTable, ForumCommentsTable, ForumPostsTable } from './forum';
import { ProfilesTable } from './profiles';
import { ReportCardsTable, TestResultsTable } from './results';
import { UserReactionsTable } from './reactions';

export interface Database {
  public: {
    Tables: {
      contacts: ContactsTable;
      forum_attachments: ForumAttachmentsTable;
      forum_comments: ForumCommentsTable;
      forum_posts: ForumPostsTable;
      profiles: ProfilesTable;
      report_cards: ReportCardsTable;
      test_results: TestResultsTable;
      user_reactions: UserReactionsTable;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: DatabaseFunctions;
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export interface DatabaseFunctions {
  check_username_available: {
    Args: {
      username_to_check: string;
    };
    Returns: boolean;
  };
}