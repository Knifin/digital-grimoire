import {Role} from "../Game/Role.ts";
import Konva from "konva";
import {NightOrder} from "../Game/NightOrder.ts";

export default class NightSheet {
    private readonly _roles: Set<Role>;
    private readonly _type: string;
    private readonly _items: NightOrder[];

    constructor(roles: Set<Role>, type: string) {
        this._roles = roles;
        this._type = type;
        this._items = [];

        roles.forEach((role: Role) => {
            if (type === 'first') {
                role.firstNightOrder?.forEach( (order: NightOrder) => {
                   this._items.push(order);
                });
            } else {
                role.otherNightOrder?.forEach( (order: NightOrder) => {
                    this._items.push(order);
                });
            }
        });

        this._items.sort((a,b) => a.index - b.index);
        console.log(this._items);
    }

    public get roles(): Set<Role> {
        return this._roles;
    }

    public get type(): string {
        return this._type;
    }

    public renderSheet(): Konva.Group {
        let width: number = 569;
        let height: number = 776;
        const group: Konva.Group = new Konva.Group({
            x: window.innerWidth-width,
            y: window.innerHeight-height,
            width: window.innerWidth,
            height: window.innerHeight,
            id: this._type + '_nightsheet',
            visible: false
        });

        let image = new Image();
        if (this._type === 'first') {
            image.src = '/img/sheets/night_order_first_background.webp';
        } else {
            image.src = '/img/sheets/night_order_other_background.webp';
        }

        let returnToGrimButton = new Image();
        returnToGrimButton.src = '/img/buttons/return_to_grim.png';

        let images: Array<Promise<HTMLImageElement>> = new Array<Promise<HTMLImageElement>>();
        images.push(this.loadImage(image));
        images.push(this.loadImage(returnToGrimButton));

        this._items.forEach( (order: NightOrder) => {
           let image = new Image();
           image.src = order.svg;
           images.push(this.loadImage(image));
        });

        // for (let role of this._roles) {
        //     if (this._type === 'first' && role.firstNightOrder !== undefined) {
        //         if (role.firstNightOrder.length > 0) {
        //             let image = new Image();
        //             image.src = role.firstNightOrder[0].svg;
        //             images.push(this.loadImage(image));
        //         }
        //     }
        //
        //     if (this._type === 'other' && role.otherNightOrder !== undefined) {
        //         if (role.otherNightOrder.length > 0) {
        //             let image = new Image();
        //             image.src = role.otherNightOrder[0].svg;
        //             images.push(this.loadImage(image));
        //         }
        //     }
        // }

        Promise.all(images).then((values): void => {
            const bg = new Konva.Image({
                x: 0,
                y: 0,
                image: values[0],
                width: width,
                height: height
            });
            const returnToGrimButton = new Konva.Image({
                x: -180,
                y: height-60,
                image: values[1],
                width: 162,
                height: 40,
                name: 'return-to-grim-button'
            });
            group.add(bg, returnToGrimButton);

            returnToGrimButton.on('dblclick dbltap', (): void => {
                group.hide();
            });

            let location = 20;
            for (let i: number = 2; i < values.length; i++) {
                let ratio: number = values[i].naturalWidth / values[i].naturalHeight;
                const role_bg = new Konva.Image({
                    x: 20,
                    y: location,
                    image: values[i],
                    width: width,
                    height: width/ratio
                });
                group.add(role_bg);

                location += width/ratio;
            }
        });

        return group;
    }

    protected loadImage(image: HTMLImageElement): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            image.onload = () => { resolve(image); }
            image.onerror = (error) => { reject(error); }
        });
    }
}