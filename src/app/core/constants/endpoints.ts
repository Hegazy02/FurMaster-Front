export class Endpoints {
  constructor() {}

  public static BASE_URL = 'http://localhost:3000';
  public static LOGIN = `${Endpoints.BASE_URL}/login`;
  public static REGISTER = `${Endpoints.BASE_URL}/register`;
  public static LOGOUT = `${Endpoints.BASE_URL}/logout`;
  public static USER = `${Endpoints.BASE_URL}/users/me`;
  public static ORDERS = `${Endpoints.BASE_URL}/orders`;
  public static PRODUCTS = `${Endpoints.BASE_URL}/products`;
  public static CATEGORIES = `${Endpoints.BASE_URL}/categories`;
  public static CART = `${Endpoints.BASE_URL}/cart`;
  public static CHECKOUT = `${Endpoints.BASE_URL}/checkout`;
  public static PAYMENT_METHODS = `${Endpoints.BASE_URL}/payment-methods`;

}
