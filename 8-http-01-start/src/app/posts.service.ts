import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private ENDPOINT_URL =
    'https://ng-course-backend-49a74-default-rtdb.firebaseio.com/';
  private POST_SUFFIX = 'posts.json';
  private completeUrl = `${this.ENDPOINT_URL}/${this.POST_SUFFIX}`;

  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createNewPost(postData: Post) {
    this.http
      .post<{ name: string }>(this.completeUrl, postData, {
        headers: new HttpHeaders({ 'Custom-Header': 'test' }),
        params: new HttpParams()
          .append('print', 'pretty')
          .append('custom', 'val'),
        observe: 'events',
      })
      .subscribe(
        (resData) => {
          console.log(resData);
        },
        (err) => {
          this.error.next(err.message);
        }
      );
  }

  fetchPosts() {
    return this.http
      .get(this.completeUrl, {
        headers: new HttpHeaders({ 'Custom-Header': 'test' }),
        params: new HttpParams()
          .append('print', 'pretty')
          .append('custom', 'val'),
        responseType: 'text',
      })
      .pipe(
        map((postsText) => JSON.parse(postsText)),
        map((postsJSON) => {
          const postsArray: Array<Post> = [];
          for (let key in postsJSON) {
            postsArray.push({
              ...postsJSON[key],
              id: key,
            });
          }
          return postsArray;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  deleteAllPosts() {
    return this.http.delete(this.completeUrl);
  }
}
