import GameEngine from "../Models/Game/GameEngine.ts";
import GameView from "../Views/GameView.ts";
import Player from "../Models/Game/Player.ts";
import Token from "../Models/Physical/Token.ts";

export default class GameController {
    private readonly _model: GameEngine;
    private readonly _view: GameView;

    constructor(model: GameEngine, view: GameView) {
        this._model = model;
        this._view = view;
    }

    public get model(): GameEngine {
        return this._model;
    }

    public get view(): GameView {
        return this._view;
    }

    public renderScene() {
        //this._view.renderTokens(this._model.getTokens());
    }

    public addPlayerToken(name: string, pronouns: string, role: string) {
        const role: Role = new Role()
        const token = new Token()
        const player = new Player(name, pronouns, )
    }
}