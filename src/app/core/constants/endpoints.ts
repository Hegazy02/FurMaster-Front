export class Endpoints {
  constructor() {}

  public static BASE_URL = 'http://localhost:3000';
  public static LOGIN = `${Endpoints.BASE_URL}/auth/login`;
  public static REGISTER = `${Endpoints.BASE_URL}/auth/sginup`;
  public static LOGOUT = `${Endpoints.BASE_URL}/auth/logout`;
  public static FORGET = `${Endpoints.BASE_URL}/auth/forget-password`;
  public static RESET = `${Endpoints.BASE_URL}/auth/reset-password`;
  public static USER = `${Endpoints.BASE_URL}/users/me`;
  public static ORDERS = `${Endpoints.BASE_URL}/orders`;
  public static COLORS = `${Endpoints.BASE_URL}/colors`;
  public static PRODUCTS = `${Endpoints.BASE_URL}/products`;
  public static ADMIN_PRODUCTS = `${Endpoints.BASE_URL}/admin/products`;
  public static CATEGORIES = `${Endpoints.BASE_URL}/categories`;
  public static CART = `${Endpoints.BASE_URL}/carts/`;
  public static CHECKOUT = `${Endpoints.BASE_URL}/checkout`;
  public static PAYMENT_METHODS = `${Endpoints.BASE_URL}/payment-methods`;
  //admin
  public static USERS = `${Endpoints.BASE_URL}/admin/users`;
}
