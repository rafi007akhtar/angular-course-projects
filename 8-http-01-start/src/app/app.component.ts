import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from './post.model';
import { PostsService } from './posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Array<Post> = [];
  isFetching = false;
  error = null;
  errorSubscription: Subscription;

  constructor(private postsService: PostsService) {}

  ngOnInit() {
    this.isFetching = true;
    this.error = null;
    this.errorSubscription = this.postsService.error.subscribe((errMsg) => {
      this.error = errMsg;
    });
    this.fetchPosts();
  }

  onCreatePost(postData: Post) {
    // Send Http request
    console.log(postData);
    this.postsService.createNewPost(postData);
  }

  onFetchPosts() {
    // Send Http request
    this.isFetching = true;
    this.error = null;
    this.fetchPosts();
  }

  fetchPosts() {
    this.postsService.fetchPosts().subscribe(
      (posts) => {
        this.isFetching = false;
        this.loadedPosts = posts;
      },
      (err) => {
        this.isFetching = false;
        this.error = err.message;
      }
    );
  }

  onClearPosts() {
    // Send Http request
    this.isFetching = true;
    this.postsService.deleteAllPosts().subscribe(() => {
      this.isFetching = false;
      this.loadedPosts.length = 0;
    });
  }

  onErrorBtnClick() {
    this.error = null;
  }

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
  }
}
