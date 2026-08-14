/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-home',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './home.html',
})
export class HomeComponent {}
