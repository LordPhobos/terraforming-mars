import {CorporationCard} from '../corporation/CorporationCard';
import {Game} from '../../Game';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {ResourceType} from '../../ResourceType';
import {ICard, IActionCard, IResourceCard} from '../ICard';
import {AndOptions} from '../../inputs/AndOptions';
import {SelectAmount} from '../../inputs/SelectAmount';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {LogHelper} from '../../LogHelper';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {PlayerInput} from '../../PlayerInput';

export class StormCraftIncorporated implements IActionCard, CorporationCard, IResourceCard {
  public name = CardName.STORMCRAFT_INCORPORATED;
  public tags = [Tags.JOVIAN];
  public startingMegaCredits: number = 48;
  public resourceType = ResourceType.FLOATER;
  public resourceCount: number = 0;
  public cardType = CardType.CORPORATION;

  public play() {
    return undefined;
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: Player, game: Game) {
    const floaterCards = player.getResourceCards(ResourceType.FLOATER);
    if (floaterCards.length === 1) {
      this.resourceCount++;
      LogHelper.logAddResource(game, player, this);
      return undefined;
    }

    return new SelectCard(
      'Select card to add 1 floater',
      'Add floater',
      floaterCards,
      (foundCards: Array<ICard>) => {
        player.addResourceTo(foundCards[0], 1);
        LogHelper.logAddResource(game, player, foundCards[0]);
        return undefined;
      },
    );
  }

  public spendHeat(player: Player, targetAmount: number,
    cb: () => (undefined | PlayerInput) = () => undefined): AndOptions {
    let heatAmount: number;
    let floaterAmount: number;

    return new AndOptions(
      () => {
        if (heatAmount + (floaterAmount * 2) < targetAmount) {
          throw new Error(`Need to pay ${targetAmount} heat`);
        }
        if (heatAmount > 0 && heatAmount - 1 + (floaterAmount * 2) >= targetAmount) {
          throw new Error(`You cannot overspend heat`);
        }
        if (floaterAmount > 0 && heatAmount + ((floaterAmount - 1) * 2) >= targetAmount) {
          throw new Error(`You cannot overspend floaters`);
        }
        player.removeResourceFrom(player.corporationCard as ICard, floaterAmount);
        player.heat -= heatAmount;
        return cb();
      },
      new SelectAmount('Select amount of heat to spend', 'Spend heat', (amount: number) => {
        heatAmount = amount;
        return undefined;
      }, 0, Math.min(player.heat, targetAmount)),
      new SelectAmount('Select amount of floaters on corporation to spend', 'Spend floaters', (amount: number) => {
        floaterAmount = amount;
        return undefined;
      }, 0, Math.min(player.getResourcesOnCorporation(), Math.ceil(targetAmount / 2))),
    );
  }

  public metadata: CardMetadata = {
    cardNumber: 'R29',
    description: 'You start with 48 MC.',
    renderData: CardRenderer.builder((b) => {
      b.br.br.br;
      b.megacredits(48);
      b.corpBox('action', (ce) => {
        ce.vSpace(CardRenderItemSize.LARGE);
        ce.effectBox((eb) => {
          eb.empty().startAction.floaters(1).asterix();
          eb.description('Action: Add a floater to ANY card.');
        });
        ce.vSpace();
        ce.effectBox((eb) => {
          eb.startEffect.floaters(1).equals().heat(2);
          eb.description('Effect: Floaters on this card may be used as 2 heat each.');
        });
      });
    }),
  }
}
