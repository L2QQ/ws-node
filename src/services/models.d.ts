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

namespace Services {
    export class Depth {
        lastUpdateId: string
        bids: [[string, string]]
        asks: [[string, string]]
    }

    export class Trade {
        id: number;
        makerOrderId: number;
        takerOrderId: number;
        isBuyerMaker: boolean;
        time: number;
        price: string;
        quantity: string;
    }
}
