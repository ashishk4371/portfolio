import { TestBed } from '@angular/core/testing';

import { ProjectService } from './project.service';

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectService);
  });

  it('orders projects newest first', () => {
    const years = service.projects().map((project) => project.year);

    expect(years).toEqual([...years].sort((a, b) => b - a));
  });

  it('only lists categories that have projects', () => {
    for (const category of service.categories()) {
      expect(category.count).toBeGreaterThan(0);
      expect(service.projects().some((project) => project.category === category.id)).toBe(true);
    }
  });

  it('filters by category and toggles the selection off', () => {
    const category = service.categories()[0]!.id;

    service.setCategory(category);
    expect(service.filteredProjects().every((project) => project.category === category)).toBe(true);

    service.setCategory(category);
    expect(service.filteredProjects()).toEqual(service.projects());
  });

  it('finds a project by slug', () => {
    const slug = service.projects()[0]!.slug;

    expect(service.find(slug)?.slug).toBe(slug);
    expect(service.find('missing')).toBeUndefined();
  });

  describe('adjacent', () => {
    it('wraps around at both ends so every project has a neighbour', () => {
      const all = service.projects();
      const firstNeighbours = service.adjacent(all[0]!.slug);
      const lastNeighbours = service.adjacent(all[all.length - 1]!.slug);

      expect(firstNeighbours.previous?.slug).toBe(all[all.length - 1]!.slug);
      expect(lastNeighbours.next?.slug).toBe(all[0]!.slug);
    });

    it('returns nulls for an unknown slug', () => {
      expect(service.adjacent('missing')).toEqual({ previous: null, next: null });
    });
  });
});
