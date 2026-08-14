/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { AppLayoutComponent } from "./app-layout";
import { AuthMenuComponent } from "../../../features/authentication/menu/auth-menu/auth-menu";

// Stub the auth-menu so this layout test stays hermetic: the real
// `app-auth-menu` boots AuthService.checkAuth() (network + Cache API) on render,
// which is out of scope here and unavailable in the unit-test environment.
@Component({ selector: "app-auth-menu", template: "" })
class StubAuthMenuComponent {}

describe("AppLayoutComponent", () => {
	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [AppLayoutComponent],
			providers: [
				provideRouter([
					{
						path: "",
						children: [
							{
								path: "accounts",
								component: AppLayoutComponent,
								data: { showInNavigation: true, label: "Accounts" },
							},
						],
					},
				]),
			],
		});
		TestBed.overrideComponent(AppLayoutComponent, {
			remove: { imports: [AuthMenuComponent] },
			add: { imports: [StubAuthMenuComponent] },
		});
		await TestBed.compileComponents();
	});

	it("should create the component", () => {
		const fixture = TestBed.createComponent(AppLayoutComponent);
		expect(fixture.componentInstance).toBeTruthy();
	});

	it("should toggle menu", () => {
		const component = TestBed.createComponent(AppLayoutComponent).componentInstance;
		expect(component.isOpen()).toBe(false);
		component.toggleMenu();
		expect(component.isOpen()).toBe(true);
		component.toggleMenu();
		expect(component.isOpen()).toBe(false);
	});

	it("should close menu", () => {
		const component = TestBed.createComponent(AppLayoutComponent).componentInstance;
		component.toggleMenu();
		expect(component.isOpen()).toBe(true);
		component.closeMenu();
		expect(component.isOpen()).toBe(false);
	});

	it("should derive navigation items from the router config", () => {
		const component = TestBed.createComponent(AppLayoutComponent).componentInstance;
		const items = component.navigationItems();
		expect(items.some((i) => i.path === "/accounts" && i.label === "Accounts")).toBe(true);
	});

	it("should render nav element", async () => {
		const fixture = TestBed.createComponent(AppLayoutComponent);
		await fixture.whenStable();
		const compiled = fixture.nativeElement as HTMLElement;
		expect(compiled.querySelector("nav")).toBeTruthy();
	});

	it("should set aria-expanded on toggle button", async () => {
		const fixture = TestBed.createComponent(AppLayoutComponent);
		await fixture.whenStable();
		const button = (fixture.nativeElement as HTMLElement).querySelector("button");
		expect(button?.getAttribute("aria-expanded")).toBe("false");

		fixture.componentInstance.toggleMenu();
		fixture.detectChanges();
		expect(button?.getAttribute("aria-expanded")).toBe("true");
	});
});
