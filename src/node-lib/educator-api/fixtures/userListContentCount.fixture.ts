import { UserListContentCountResponse } from "../queries/getUserListContentCount/getUserListContentCount.types";

const userListContentCountFixture = (
  partial?: Partial<
    UserListContentCountResponse["content_lists_aggregate"]["aggregate"]
  >,
): UserListContentCountResponse => {
  return {
    content_lists_aggregate: { aggregate: { count: 10, ...partial } },
  };
};
export default userListContentCountFixture;
