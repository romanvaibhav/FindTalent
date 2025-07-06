import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../cors/service/auth.service';
import { io } from 'socket.io-client';
import { SocketService } from '../../cors/socket/socket.service';
import sdk, { VM } from '@stackblitz/sdk';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-assesment-page',
  imports: [],
  templateUrl: './assesment-page.component.html',
  styleUrl: './assesment-page.component.css',
})
export class AssesmentPageComponent {
  // public safeUrl!: SafeResourceUrl;
  stakId: any;
  openFile: any;
  private vm!: VM;
  private socket: any;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private socketService: SocketService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private athService: AuthService,
    private router: Router
  ) {
    this.socket = io(environment.API_HOST_URL);
  }
  projectId: any;
  project: any;
  safeUrl: any;

  ngOnInit() {
    this.projectId = this.route.snapshot.queryParams['id'];
    // this.project = this.route.snapshot.queryParams['id'];

    console.log('ID from query params:', this.projectId);
    // this.getProjectById();
    // if(this.project){
    //   this.getProjectById();
    // }
    this.getChallengeById();
  }

  updateIframeCode(data: string) {
    // Find the iframe element
    const iframe = document.querySelector('iframe');
    if (iframe) {
      // Send code to the iframe using postMessage (can be used with an embedded editor)
      iframe.contentWindow?.postMessage(data, '*');
    }
  }

  sendCodeUpdate(code: string) {
    this.socket.emit('codeUpdate', code); // Emit the code change to the server
  }

  getProjectById() {
    this.athService.getProjectById(this.projectId).subscribe({
      next: (value: any) => {
        console.log('Got the value', value);
        const Url = value.StackBlitzUrl;
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(Url);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  async getChallengeById() {
    this.athService.getOneChallengeById(this.projectId).subscribe({
      next: (value: any) => {
        console.log('printing the value', value);
        if (value.challenges[0].status == 'Completed') {
          // this.router.navigateByUrl("");
          this.router.navigate(['/assesment/expired'], { replaceUrl: true });
        } else {
          const Url = value.challenges[0].url;
          console.log('Printing Url', Url);
          console.log(value.challenges[0]?.code?.file);

          if (value.challenges[0]?.code) {
            const data = value.challenges[0]?.code.file;
            console.log('Printing File', data);

            this.embedSavedProject(data);
          } else {
            const parts = Url.split('/edit/');
            const id = parts[1].split('?')[0];
            this.stakId = id;
            console.log(id);

            // Extracting file name
            // const params = new URL(Url).searchParams;
            // const fileName = params.get("file");
            // console.log(fileName);

            this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(Url);
            // this.pathcChallengeById();
            this.embedDefaultProject();
          }
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  score: any;
  embedDefaultProject() {
    console.log(this.projectId);
    sdk
      .embedProjectId('embed', this.stakId, {
        forceEmbedLayout: true,
        terminalHeight: 50,
        height: 600,
      })
      .then((vmInstance) => {
        this.vm = vmInstance;
      });
  }
  async getCodeSnapshot() {
    try {
      if (!this.vm) {
        throw new Error('SDK VM is not initialized yet.');
      }

      // Getting the filesystem snapshot
      const snapshot = await this.vm.getFsSnapshot();

      if (!snapshot) {
        throw new Error('Failed to get a valid filesystem snapshot.');
      }

      console.log('Filesystem Snapshot:', snapshot);

      // Applying the filesystem diff (creating files from the snapshot)
      await this.vm.applyFsDiff({
        create: snapshot,
        destroy: [],
      });

      console.log('Filesystem diff applied successfully.');
    } catch (error) {
      console.error('Error during getCodeSnapshot:', error);
    }
  }

  status: any;
  async embedSavedProject(files: any) {
    // Ensure files are properly formatted
    const formattedFiles = this.formatFiles(files);

    // Detect project type before embedding
    const projectTemplate = this.detectProjectTemplate(formattedFiles);

    await sdk
      .embedProject(
        'embed',
        {
          title: 'Saved Project',
          description: 'Loaded from database',
          template: 'node', // Dynamically detected template
          files: files,
        },
        {
          height: 742,
          // forceEmbedLayout: true
        }
      )
      .then((vmInstance) => {
        this.vm = vmInstance;
        console.log('VM Instance:', this.vm);
      })
      .catch((err) => {
        console.error('Error embedding project:', err);
      });
  }

  isLoading: boolean = false;

  async saveProject() {
    this.isLoading = true;
    if (this.vm) {
      const snapshot = await this.vm.getFsSnapshot();
      console.log(snapshot);
      const score = '';
      const status = '';
      this.authService
        .patchChallenge(this.projectId, score, status, snapshot)
        .subscribe((res: any) => {
          console.log('Saved');
          this.socket.emit('saveProjectByCandidate');

          this.isLoading = false;
          // this.toastService.getToast('success', 'code saved');
        });
    } else {
      this.isLoading = false;
      console.error('SDK VM is not Found.');
    }
  }

  // pathcChallengeById(){
  //   const status="In-Progress";
  //   this.athService.patchChallenge(this.projectId,this.score,this.status).subscribe({next:(value:any)=>{
  //     console.log("Succesfully patcvalue.challenges[0].code.filehed the values",value);
  //   },
  //   error:(err)=>{
  //     console.log("Got the error at the patching challenge values",err);
  //   }
  // })
  // }

  submitBtn() {
    const status = 'Completed';
    const statusData = {
      status: status,
      projectId: this.projectId, // Your project ID
    };
    const snapshot: File | null = null;
    this.athService
      .patchChallenge(this.projectId, status, this.score, snapshot)
      .subscribe({
        next: (value: any) => {
          console.log('Succesfully patched the values', value);
          // this.router.navigateByUrl("");
          this.socketService.emitStatusUpdated(statusData);

          this.router.navigate(['assesment/completed'], { replaceUrl: true });
        },
        error: (err) => {
          console.log('Got the error at the patching challenge values', err);
        },
      });
  }

  detectProjectTemplate(files: any) {
    if (!files || typeof files !== 'object') return 'javascript'; // Fallback

    if (files['angular.json']) return 'angular-cli';
    if (files['package.json']?.content?.includes('"react"'))
      return 'create-react-app';
    if (files['index.html'] && files['script.js']) return 'html';
    if (files['index.js']) return 'javascript';
    if (files['server.js'] || files['index.ts']) return 'node';
    if (files['tsconfig.json']) return 'typescript';
    if (files['polymer.json']) return 'polymer';
    if (files['vue.config.js']) return 'vue';

    return 'javascript'; // Default fallback
  }

  formatFiles(files: any): any {
    const formattedFiles: any = {};
    for (const [key, value] of Object.entries(files)) {
      formattedFiles[key] = { content: value }; // Convert into StackBlitz format
    }
    return formattedFiles;
  }
}

// <iframe [src]="safeUrl"
//         style="width: 100vw; height: 100vh; border: none;"
//         frameborder="0">
// </iframe>
