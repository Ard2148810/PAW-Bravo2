import { Component, OnInit } from '@angular/core';
import {Board} from '../../entities/board';
import {BoardService} from '../../services/board.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-public-board',
  templateUrl: './public-board.component.html',
  styleUrls: ['./public-board.component.sass']
})
export class PublicBoardComponent implements OnInit {

  id: string;
  data: Board;

  boardReady: boolean;

  error: boolean;
  errorMessage: string;

  constructor(private boardService: BoardService,
              private route: ActivatedRoute,
              private router: Router) {
    route.params.subscribe(params => this.id = params.id);
    this.boardReady = false;
    this.error = false;
  }

  ngOnInit(): void {
    this.boardService.getBoard(this.id).subscribe(data => {
      this.data = data;
      this.boardReady = true;
      console.log(this.data);
    });

    // this.boardService.getPublicLink(this.id).subscribe(
    //   response => {
    //     console.log(response);
    //   }, error => {
    //     console.log(error);
    //   });

    // this.boardService.getPublicBoard(this.id)
    // .subscribe(
    //   response => {
    //     this.data = response;
    //     this.boardReady = true;
    //     console.log(this.data);
    //   },
    //   error => {
    //     // this.displayError(error);
    //   });
  }

  getBoardDisplayName(): string {
    return this.data ? this.data.name : 'Loading...';
  }

  navigateBack(): void {
    this.router.navigate(['..'])
      .catch(console.log);
  }

  toggleErrorModal(): void{
    this.error = !this.error;
  }

  displayError(message: string): void{
    this.errorMessage = 'ERROR: ' + message;
    console.log(this.errorMessage);
    this.error = true;
  }

}