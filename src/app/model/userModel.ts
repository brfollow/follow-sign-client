export class SignatureModel {
  name: string = '';
  phone: string = '';
  type: string = '';
  email: string = '';
}

export class UserModel {
  id: string = '';
  idUser: string = '';
  cpfUser: string = '';
  nameUser: string = '';
  emailUser: string = '';
  signature!: SignatureModel;
}
