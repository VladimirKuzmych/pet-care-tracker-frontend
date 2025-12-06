# PetCareTrackerFrontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 21.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Components

### Modal Component

A reusable modal component that can be used throughout the application.

**Usage:**

```typescript
import { Modal } from './components/modal/modal';

@Component({
  // ...
  imports: [Modal, ...],
})
export class YourComponent {
  showModal = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}
```

```html
<app-modal [isOpen]="showModal" [title]="'Your Modal Title'" (close)="closeModal()">
  <!-- Your modal content here -->
  <form>
    <div class="form-group">
      <label>Field Name</label>
      <input type="text" />
    </div>
    <button type="submit">Submit</button>
  </form>
</app-modal>
```

**Inputs:**
- `isOpen` (boolean): Controls modal visibility
- `title` (string): Modal header title
- `showCloseButton` (boolean, default: true): Show/hide close button

**Outputs:**
- `close`: Emitted when modal should be closed (overlay click or close button)

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
