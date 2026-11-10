import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportToCSV, escapeHtml, printSection } from './exportUtils';

describe('exportUtils', () => {
  describe('escapeHtml', () => {
    it('escapes &, <, >, ", and \' characters correctly to prevent XSS', () => {
      const malicious = '<script>alert("XSS & attack\'s")</script>';
      const safe = escapeHtml(malicious);
      expect(safe).toBe(
        '&lt;script&gt;alert(&quot;XSS &amp; attack&#39;s&quot;)&lt;/script&gt;'
      );
    });

    it('returns an empty string unchanged', () => {
      expect(escapeHtml('')).toBe('');
    });

    it('leaves standard text unchanged', () => {
      expect(escapeHtml('TGSRTC Route Schedule')).toBe('TGSRTC Route Schedule');
    });
  });

  describe('exportToCSV', () => {
    let originalCreateObjectURL: typeof URL.createObjectURL;
    let originalRevokeObjectURL: typeof URL.revokeObjectURL;
    let createdBlobs: Blob[] = [];

    beforeEach(() => {
      createdBlobs = [];
      originalCreateObjectURL = URL.createObjectURL;
      originalRevokeObjectURL = URL.revokeObjectURL;

      URL.createObjectURL = vi.fn((blob: Blob) => {
        createdBlobs.push(blob);
        return 'mock-blob-url';
      });
      URL.revokeObjectURL = vi.fn();
    });

    afterEach(() => {
      URL.createObjectURL = originalCreateObjectURL;
      URL.revokeObjectURL = originalRevokeObjectURL;
    });

    it('creates a CSV blob with proper headers and row values', async () => {
      const headers = ['Vehicle ID', 'Route', 'Status'];
      const rows = [
        ['TG-03-Z-1089', 'Line 101', 'In Service'],
        ['TG-03-Z-2045', 'Line 204', 'Delayed'],
      ];

      exportToCSV('test_report', headers, rows);

      expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
      expect(createdBlobs.length).toBe(1);

      const blobText = await createdBlobs[0].text();
      const lines = blobText.split('\n');

      expect(lines[0]).toBe('"Vehicle ID","Route","Status"');
      expect(lines[1]).toBe('"TG-03-Z-1089","Line 101","In Service"');
      expect(lines[2]).toBe('"TG-03-Z-2045","Line 204","Delayed"');
    });

    it('escapes embedded double quotes by doubling them', async () => {
      const headers = ['Notes'];
      const rows = [['Driver said "Proceed to Depot"']];

      exportToCSV('quotes_report', headers, rows);

      const blobText = await createdBlobs[0].text();
      expect(blobText).toContain('"Driver said ""Proceed to Depot"""');
    });

    it('handles numeric and nullish cell values cleanly', async () => {
      const headers = ['ID', 'Speed', 'Variance'];
      const rows = [
        ['V1', 45, 0],
        ['V2', null, undefined],
      ];

      exportToCSV('numbers_report', headers, rows);

      const blobText = await createdBlobs[0].text();
      const lines = blobText.split('\n');
      expect(lines[1]).toBe('"V1","45","0"');
      expect(lines[2]).toBe('"V2","",""');
    });
  });

  describe('printSection', () => {
    it('returns early and safely if element does not exist in DOM', () => {
      const windowSpy = vi.spyOn(window, 'open');
      printSection('non-existent-id', 'Test Title');
      expect(windowSpy).not.toHaveBeenCalled();
      windowSpy.mockRestore();
    });

    it('escapes HTML in title when generating the print window', () => {
      const div = document.createElement('div');
      div.id = 'printable-content';
      div.innerHTML = '<p>Report Body</p>';
      document.body.appendChild(div);

      const mockWrite = vi.fn();
      const mockClose = vi.fn();
      const mockPrintWindow = {
        document: {
          write: mockWrite,
          close: mockClose,
        },
      } as unknown as Window;

      vi.spyOn(window, 'open').mockReturnValue(mockPrintWindow);

      printSection('printable-content', '<img src=x onerror=alert(1)>');

      expect(mockWrite).toHaveBeenCalled();
      const htmlWritten = mockWrite.mock.calls[0][0];

      // Should contain escaped title, not raw tags
      expect(htmlWritten).toContain('&lt;img src=x onerror=alert(1)&gt;');
      expect(htmlWritten).not.toContain('<img src=x onerror=alert(1)>');
      expect(htmlWritten).toContain('TGSRTC Official Report');

      document.body.removeChild(div);
      vi.restoreAllMocks();
    });
  });
});
