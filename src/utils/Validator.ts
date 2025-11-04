import { ConnectFour } from "../gameLogic/connectFour";
import { TBoard, TPlayer, TPosition } from "../gameLogic/types";

type TBoardState = 'waiting' | 'pending' | 'win' | 'draw';

interface IWinner {
    who: TPlayer;
    positions: TPosition[];
}

interface IStepData {
    player_1: TPosition[];
    player_2: TPosition[];
    board_state: TBoardState;
    winner?: IWinner;
}

export interface IValidatorOption {
    [key: string]: IStepData;
}

function getPlayerPositions(board: TBoard, player: TPlayer): TPosition[] {
    const positions: TPosition[] = [];

    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] === player) {
                positions.push([row, col]);
            }
        }
    }

    return positions;
}

export function validator(moves: number[]): IValidatorOption {
    const result: IValidatorOption = {};

    result.step_0 = {
        player_1: [],
        player_2: [],
        board_state: 'waiting',
    };

    if (moves.length === 0) return result;

    const game = new ConnectFour(false, 'easy');

    for (let moveIndex = 0; moveIndex < moves.length; moveIndex++) {
        const col = moves[moveIndex];

        if (col < 0 || col > 6) {
            console.warn(`Invalid column: ${col}`);
            break;
        }

        game.dropTrick(col);

        const player1Positions = getPlayerPositions(game.board, 'onePlayer');
        const player2Positions = getPlayerPositions(game.board, 'twoPlayer');

        let boardState: TBoardState = 'pending';
        let winner: IWinner | undefined = undefined;

        if (game.winner) {
            boardState = 'win';
            winner = {
                who: game.winner,
                positions: game.winningPositions,
            };
        } else if (game.isDraw) {
            boardState = 'draw';
        }

        const stepKey = `step_${moveIndex + 1}`;
        
        const stepData: IStepData = {
            player_1: player1Positions,
            player_2: player2Positions,
            board_state: boardState,
        };

        if (winner) {
            stepData.winner = winner;
        }

        result[stepKey] = stepData;

        if (boardState === 'win' || boardState === 'draw') {
            break;
        }
    }

    return result;
}
