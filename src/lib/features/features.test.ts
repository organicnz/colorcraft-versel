import { FEATURES } from './schema';
import { isFeatureEnabled, setFeatureFlag, deleteFeatureFlag, clearFeatureFlagCache } from './index';

// Mock DB operations
jest.mock('@/lib/db', () => {
  const mockFlags = new Map();
  
  return {
    db: {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockImplementation(() => {
        return [mockFlags.get('currentFlag')];
      }),
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      returning: jest.fn().mockImplementation(() => {
        const flag = mockFlags.get('currentFlag');
        return flag ? [flag] : [];
      }),
      execute: jest.fn(),
      // Add helper for tests to set mock data
      __setMockFlag: (flag) => {
        mockFlags.set('currentFlag', flag);
      },
      __clearMockFlags: () => {
        mockFlags.clear();
      }
    }
  };
});

// Mock logger
jest.mock('@/lib/logger', () => ({
  apiLogger: {
    warn: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  }
}));

// Mock error monitor
jest.mock('@/lib/errors/monitoring', () => ({
  errorMonitor: {
    captureError: jest.fn(),
  }
}));

describe('Feature Flag System', () => {
  beforeEach(() => {
    jest.resetModules();
    
    // Clear mock data
    const { db } = require('@/lib/db');
    db.__clearMockFlags();
    
    // Clear cache
    clearFeatureFlagCache();
    
    // Reset environment
    process.env.NODE_ENV = 'test';
  });
  
  describe('isFeatureEnabled', () => {
    it('should return default value when flag not in database', async () => {
      const result = await isFeatureEnabled(FEATURES.NEW_DASHBOARD_UI);
      expect(result).toBe(FEATURES.NEW_DASHBOARD_UI.defaultValue);
    });
    
    it('should return value from database when flag exists', async () => {
      const { db } = require('@/lib/db');
      
      // Set mock flag in database
      db.__setMockFlag({
        id: '123',
        name: FEATURES.ADVANCED_ANALYTICS.name,
        is_enabled: true,
        environment: 'development',
      });
      
      const result = await isFeatureEnabled(FEATURES.ADVANCED_ANALYTICS);
      expect(result).toBe(true);
    });
    
    it('should respect environment settings', async () => {
      const { db } = require('@/lib/db');
      
      // Feature only enabled in production
      const mockFeature = {
        name: 'prod_only_feature',
        defaultValue: false,
        environments: ['production'],
      };
      
      // Test env should return default value
      const result = await isFeatureEnabled(mockFeature);
      expect(result).toBe(false);
      
      // Set to production and try again
      process.env.NODE_ENV = 'production';
      
      // Mock a database flag for production
      db.__setMockFlag({
        id: '456',
        name: mockFeature.name,
        is_enabled: true,
        environment: 'production',
      });
      
      const prodResult = await isFeatureEnabled(mockFeature, { environment: 'production' });
      expect(prodResult).toBe(true);
    });
  });
  
  describe('setFeatureFlag', () => {
    it('should create a new flag if it does not exist', async () => {
      const { db } = require('@/lib/db');
      
      // No existing flag
      db.__setMockFlag(null);
      
      // Set up the return value for the new flag
      const mockNewFlag = {
        id: '789',
        name: 'new_feature',
        is_enabled: true,
        description: 'A new feature',
        environment: 'development',
      };
      
      db.__setMockFlag(mockNewFlag);
      
      const result = await setFeatureFlag({
        name: 'new_feature',
        is_enabled: true,
        description: 'A new feature',
      });
      
      expect(result).toEqual(mockNewFlag);
    });
    
    it('should update an existing flag', async () => {
      const { db } = require('@/lib/db');
      
      // Existing flag
      const existingFlag = {
        id: '101',
        name: 'existing_feature',
        is_enabled: false,
        description: 'An existing feature',
        environment: 'development',
      };
      
      db.__setMockFlag(existingFlag);
      
      // Set up the return value for the updated flag
      const updatedFlag = {
        ...existingFlag,
        is_enabled: true,
        description: 'Updated description',
        updated_at: new Date(),
      };
      
      db.__setMockFlag(updatedFlag);
      
      const result = await setFeatureFlag({
        name: 'existing_feature',
        is_enabled: true,
        description: 'Updated description',
      });
      
      expect(result).toEqual(updatedFlag);
    });
  });
  
  describe('deleteFeatureFlag', () => {
    it('should call delete on the database', async () => {
      const { db } = require('@/lib/db');
      const deleteSpy = jest.spyOn(db, 'delete');
      
      await deleteFeatureFlag('test_feature');
      
      expect(deleteSpy).toHaveBeenCalled();
    });
  });
});
