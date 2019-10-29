
import { Player } from "../Player";
import { Game } from "../Game";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { AndOptions } from "../inputs/AndOptions";
import { OrOptions } from "../inputs/OrOptions";
import { SelectSpace } from "../inputs/SelectSpace";
import { SelectCard } from "../inputs/SelectCard";
import { SelectOption } from "../inputs/SelectOption";
import { ISpace } from "../ISpace";
import { PlayerInput } from "../PlayerInput";

export class LargeConvoy implements IProjectCard {
    public cost: number = 36;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.EARTH, Tags.SPACE];
    public name: string = "Large Convoy";
    public cardType: CardType = CardType.EVENT;
    public text: string = "Place an ocean tile and draw 2 cards. Gain 5 plants, or add 4 animals to ANOTHER card. Gain 2 Victory Points.";
    public description: string = "Huge delivery from Earth";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, game: Game): PlayerInput {
        return new AndOptions(
            () => {
                player.cardsInHand.push(game.dealer.dealCard(), game.dealer.dealCard());
                player.victoryPoints += 2;
                return undefined;
            },
            new SelectSpace("Select space for ocean tile", game.getAvailableSpacesForOcean(player), (space: ISpace) => {
                game.addOceanTile(player, space.id);
                return undefined;
            }),
            new OrOptions(
                new SelectOption("Gain 5 plants", () => { player.plants += 5; return undefined; }),
                new SelectCard("Select card to add 4 animals", game.getOtherAnimalCards(this), (foundCards: Array<IProjectCard>) => { 
                    player.addResourceTo(foundCards[0], 4);
                    return undefined;
                })
            )
        );
    }
}
