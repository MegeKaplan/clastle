import { AbilityBuilder, PureAbility } from "@casl/ability";
import { createPrismaAbility, PrismaQuery, Subjects } from "@casl/prisma";
import { Club, Prisma, Role, User, UserStatus } from "../../generated/prisma/client.js";

export type AppAbility = PureAbility<[string, 'all' | Subjects<{
  User: User;
  Club: Club;
}>], PrismaQuery>;

export function defineAbilityForUser(user?: User) {
  if (user) return createPrismaAbility(defineRulesForUser(user));
  return createPrismaAbility(defineRulesForUser());
}

export function defineRulesForUser(user?: User) {
  const builder = new AbilityBuilder<AppAbility>(createPrismaAbility);

  if (!user) {
    defineGuestRules(builder);
    return builder.rules;
  }

  if (user.status === UserStatus.PENDING) {
    definePendingUserRules(builder, user);
    defineGuestRules(builder);
    return builder.rules;
  }

  if (user.status !== UserStatus.ACTIVE) {
    defineGuestRules(builder);
    return builder.rules;
  }

  switch (user?.role) {
    case Role.SUPERADMIN:
      defineSuperAdminRules(builder);
      break;
    case Role.ADMIN:
      defineAdminRules(builder);
      defineUserRules(builder, user);
      break;
    case Role.USER:
      defineUserRules(builder, user);
      defineGuestRules(builder);
      break;
    default:
      defineGuestRules(builder);
  }

  return builder.rules;
}

function defineSuperAdminRules({ can }: AbilityBuilder<AppAbility>) {
  can("manage", "all");
}

function defineAdminRules({ can }: AbilityBuilder<AppAbility>) {
  can("approve", "User", {
    role: Role.USER,
    status: UserStatus.PENDING
  } as Prisma.UserWhereInput);
  can("reject", "User", {
    role: Role.USER,
    status: UserStatus.PENDING
  } as Prisma.UserWhereInput);
}

function defineUserRules({ can }: AbilityBuilder<AppAbility>, user: User) {
  can(["read", "update"], "User", {
    id: user.id
  });
  can(["join", "leave"], "Club");
}

function definePendingUserRules({ can }: AbilityBuilder<AppAbility>, user?: User) {
  can("join", "Club");
  can("update", "User", {
    id: user?.id
  } as Prisma.UserWhereInput);
}

function defineGuestRules({ can }: AbilityBuilder<AppAbility>) {
  can("read", "User");
}