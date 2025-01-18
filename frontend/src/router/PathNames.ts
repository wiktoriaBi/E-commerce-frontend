/** Definiuje kolekcję ścieżek (kontekstów URL), które mogą prowadzić do widoków aplikacji
 */
export const PathNames = {
    anonymous: {
        register: '/register',
        login: '/'
    },
    client: {
        products: '/products',
        cart: '/cart',
        orders: '/orders'
    },
    worker: {
        products: '/products',
        orders: '/orders'
    }
}