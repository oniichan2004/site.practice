export interface RegisterDto {
    email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string

}
export interface RegisterResponse {
    accesToken: string,
    refreshToken : string
}
