import { IGlobalEvent } from './IGlobalEvent';
import { GlobalEventName } from './GlobalEventName';
import { PartyName } from '../parties/PartyName';
import { Game } from '../../Game';
import { Resources } from '../../Resources';
import { Turmoil } from '../Turmoil';

export class GenerousFunding implements IGlobalEvent {
    public name = GlobalEventName.GENEROUS_FUNDING;
    public revealedDelegate = PartyName.KELVINISTS;
    public currentDelegate = PartyName.UNITY;
    public resolve(game: Game, turmoil: Turmoil) {
        game.getPlayers().forEach(player => {
            player.setResource(Resources.MEGACREDITS, 2 * (Math.min(5, Math.floor((player.terraformRating - 15) / 5)) + turmoil.getPlayerInfluence(player)), undefined, undefined, true);
        });    
    }
}    