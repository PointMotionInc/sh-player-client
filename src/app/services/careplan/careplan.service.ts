import { Injectable } from "@angular/core";
import { GqlConstants } from "src/app/services/gql-constants/gql-constants.constants";
import { GraphqlService } from "src/app/services/graphql/graphql.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class CareplanService {
  constructor(private graphqlService: GraphqlService) {}

  async getAvailableGames() {
    const games = await this.graphqlService.gqlRequest(
      GqlConstants.GET_AVAILABLE_GAMES
    );

    const allowMovingTones = environment.name !== "prod" && environment.name !== "stage";

    if (!allowMovingTones && games?.game_name) {
      games.game_name = games.game_name.filter((game: { name: string }) => game.name !== "moving_tones");
    }

    return games;
  }
}
