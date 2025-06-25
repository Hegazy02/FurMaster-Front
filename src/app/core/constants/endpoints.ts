export class Endpoints {
  constructor() {}

  public static PROD_BASE_URL = 'https://fur-master-back.vercel.app';
  public static DEV_BASE_URL = 'http://localhost:3000';
  public static BASE_URL = Endpoints.PROD_BASE_URL;
  public static LOGIN = `${Endpoints.PROD_BASE_URL}/auth/login`;
  public static REGISTER = `${Endpoints.BASE_URL}/auth/sginup`;
  public static LOGOUT = `${Endpoints.BASE_URL}/auth/logout`;
  public static FORGET = `${Endpoints.BASE_URL}/auth/forget-password`;
  public static RESET = `${Endpoints.BASE_URL}/auth/reset-password`;
  public static USER = `${Endpoints.BASE_URL}/users/me`;
  public static ORDERS = `${Endpoints.BASE_URL}/orders`;
  public static COLORS = `${Endpoints.BASE_URL}/colors`;
  public static PRODUCTS = `${Endpoints.BASE_URL}/products`;
  public static CATEGORIES = `${Endpoints.BASE_URL}/categories`;
  public static CART = `${Endpoints.BASE_URL}/cart/`;
  public static CHECKOUT = `${Endpoints.BASE_URL}/checkout`;
  public static PAYMENT_METHODS = `${Endpoints.BASE_URL}/payment-methods`;
  public static STRIPE_PUBLIC_KEY = `pk_test_51RWy8uCGLUGEZz6R7hPCRIbxnTzX3YGn30YDVY65ydOh0tjAiRRYkzIGx6dCTsWeUcNEKOm7bGfi2UFGqWHgdZsm00VILAkIod`;
  public static ORDER = `${Endpoints.BASE_URL}/api/orders/user`;
  //admin
  public static USERS = `${Endpoints.BASE_URL}/admin/users`;
  public static ADMIN_PRODUCTS = `${Endpoints.BASE_URL}/admin/products`;
  public static ADMIN_ORDERS = `${Endpoints.BASE_URL}/admin/orders`;
  public static CUSTOMER_GENDER_STATISTICS = `${Endpoints.BASE_URL}/admin/customerGenderStatistics`;
  public static TOTAL_ORDERS_STATISTICS = `${Endpoints.BASE_URL}/admin/totalOrdersStatistics`;
  public static TOTAL_ORDERS_AMOUNT_STATISTICS = `${Endpoints.BASE_URL}/admin/totalOrdersAmountStatistics`;
  public static BEST_SELLING_PRODUCTS = `${Endpoints.BASE_URL}/admin/bestSellingProducts`;
}
