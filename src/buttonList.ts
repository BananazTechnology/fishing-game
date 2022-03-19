import { ShopAccept } from './commands/shop/shop-accept'
import { ShopDeny } from './commands/shop/shop-deny'
import { ButtonClick } from './interfaces/buttonClick'

export const ButtonInteractions: ButtonClick[] = [ShopAccept, ShopDeny]
