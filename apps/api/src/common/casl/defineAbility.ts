import { AbilityBuilder, PureAbility } from "@casl/ability";
import { createPrismaAbility, PrismaQuery, Subjects } from "@casl/prisma";
import { User } from "../../generated/prisma/client.js";

export type AppAbility = PureAbility<[string, 'all' | Subjects<{
  User: User;
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

  switch (user?.role) {
    case 'SUPERADMIN':
      defineSuperAdminRules(builder);
      break;
    case 'ADMIN':
      defineAdminRules(builder);
      defineUserRules(builder, user);
      break;
    case 'USER':
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
  can(["update"], ["User"]);
}

function defineUserRules({ can }: AbilityBuilder<AppAbility>, user: User) {
  can(["read", "create", "update"], ["User"], {
    id: user.id
  });
}

function defineGuestRules({ can }: AbilityBuilder<AppAbility>) {
  can(["read"], ["User"]);
}