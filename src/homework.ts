// 1.
type ItemType = { name: string, price: number };

function addItemInfoDecorator(target: Object, methodName: string, descriptor: TypedPropertyDescriptor<() => ItemType>): void {
    const method = descriptor.value;
    descriptor.value = function (): ItemType & { date: Date, info: string } {
        const result: ItemType = method.apply(this);
        const dollarFormat = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
        return {
            name: result.name,
            price: result.price,
            date: new Date(),
            info: `${result.name} – ${dollarFormat.format(result.price)}`
        };
    }
}

class Item {
    public price: number;
    public name: string;

    constructor(name: string, price: number) {
        this.name = name;
        this.price = price;
    }

    @addItemInfoDecorator
    public getItemInfo() {
        return {
            name: this.name,
            price: this.price
        };
    }
}

const item = new Item('Apple', 100);
console.log(item.getItemInfo());

// 2.
function UserType(type: string) {
    return function <T extends { new(...args: any[]): {} }>(objectConstructor: T) {
        return class extends objectConstructor {
            public readonly createDate: Date = new Date;
            public type: string = type;
        }
    }
}

@UserType("user")
class PublicUser {
    constructor(public firstName: string,
        public lastName: string) { }
}

const user = new PublicUser("Vadim", "Ovchinnikov");
console.log(user);

// 3.
namespace USA {
    // News api USA
    export interface INews {
        id: number;
        title: string;
        text: string;
        author: string;
    }

    export class NewsService {
        protected apiurl: string = 'https://news_api_usa_url'
        public getNews() { } // method
    }
}

namespace Ukraine {
    // News api Ukraine
    export interface INews {
        uuid: string;
        title: string;
        body: string;
        author: string;
        date: string;
        imgUrl: string;
    }

    export class NewsService {
        protected apiurl: string = 'https://news_api_2_url'
        public getNews() { } // method get all news
        public addToFavorite() { } // method add to favorites
    }
}

// 4.
class Junior {
    public doTasks(): void { console.log('Actions!!!'); }
}

class Middle {
    public createApp(): void { console.log('Creating!!!'); }
}

class Senior {
    public createArchitecture(): void { console.log('Working on architecture!!!'); }
    public doTasks(): void { } // Junior
    public createApp(): void { } // Middle
}

function applyMixin(targetClass: any, baseClasses: any[]) {
    baseClasses.forEach((baseClass) => {
        Object.getOwnPropertyNames(baseClass.prototype).forEach((propName) => {
            targetClass.prototype[propName] = baseClass.prototype[propName];
        });
    });
}

applyMixin(Senior, [Junior, Middle]);