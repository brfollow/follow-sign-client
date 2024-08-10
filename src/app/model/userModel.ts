export class SignatureModel {
  name: string = '';
  email: string = '';
  type: string = '';
  phone: string = '';
}
export class UserModel {
  id: string = '';
  idUser: string = '';
  cpfUser: string = '';
  nameUser: string = '';
  emailUser: string = '';
  signature!: SignatureModel;
}
