namespace Rabbit {
    export class Trade {
        symbol: string;
        id: number;
        makerOrderId: number;
        takerOrderId: number;
        isBuyerMaker: boolean;
        time: number;
        price: string;
        quantity: string;
    }

    export class Order {

    }

    export class Account {
        id: number;
    }
}

namespace Commander {
    export class Depth {

    }
}
