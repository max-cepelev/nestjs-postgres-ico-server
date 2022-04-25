export class CreateUserDto {
  readonly email: string;
  readonly password: string;
  readonly phone: string;
  readonly name: string;
  readonly activationLink: string;
  readonly roleId: number;
  readonly isActivated: boolean;
}
