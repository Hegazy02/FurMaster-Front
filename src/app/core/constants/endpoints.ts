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
  public static CART = `${Endpoints.BASE_URL}/cart/`;
  public static CHECKOUT = `${Endpoints.BASE_URL}/checkout`;
  public static PAYMENT_METHODS = `${Endpoints.BASE_URL}/payment-methods`;
   public static STRIPE_PUBLIC_KEY=`pk_test_51RWy8uCGLUGEZz6R7hPCRIbxnTzX3YGn30YDVY65ydOh0tjAiRRYkzIGx6dCTsWeUcNEKOm7bGfi2UFGqWHgdZsm00VILAkIod`;
   public static ORDER=`http://localhost:3000/api/orders/user`;
  //admin
  public static USERS = `${Endpoints.BASE_URL}/admin/users`;

}
