'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface Student {
  name: string;
  nim: string;
}

export interface Resource {
  name: string;
  label: string;
  description: string;
}

export interface Endpoints {
  list: string;
  detail: string;
  create: string;
  update: string;
  delete: string;
}

export interface SchemaField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'date' | 'textarea' | 'select' | 'boolean';
  required?: boolean;
  showInTable?: boolean;
  options?: string[];
}

export interface ApiSchemaConfig {
  student?: Student;
  resource?: Resource;
  fields?: SchemaField[];
  endpoints?: Endpoints;
}

export interface ApiSchema {
  [key: string]: 'text' | 'number' | 'email' | 'date' | 'select' | 'boolean' | 'textarea';
}

export interface ApiContextType {
  baseUrl: string;
  setBaseUrl: (url: string) => void;
  schema: ApiSchema;
  setSchema: (schema: ApiSchema) => void;
  schemaConfig: ApiSchemaConfig;
  setSchemaConfig: (config: ApiSchemaConfig) => void;
  student: Student | null;
  setStudent: (student: Student | null) => void;
  resource: Resource | null;
  setResource: (resource: Resource | null) => void;
  endpoints: Endpoints | null;
  setEndpoints: (endpoints: Endpoints | null) => void;
  fields: SchemaField[];
  setFields: (fields: SchemaField[]) => void;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  activeResource: string;
  setActiveResource: (resource: string) => void;
  recordCount: number;
  setRecordCount: (count: number) => void;
  lastResponseTime: number;
  setLastResponseTime: (time: number) => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const [baseUrl, setBaseUrl] = useState<string>('');
  const [schema, setSchema] = useState<ApiSchema>({});
  const [schemaConfig, setSchemaConfig] = useState<ApiSchemaConfig>({});
  const [student, setStudent] = useState<Student | null>(null);
  const [resource, setResource] = useState<Resource | null>(null);
  const [endpoints, setEndpoints] = useState<Endpoints | null>(null);
  const [fields, setFields] = useState<SchemaField[]>([]);
  const [isConnected, setIsConnectedState] = useState(false);
  const [activeResource, setActiveResourceState] = useState('');

  const setIsConnected = useCallback((connected: boolean) => {
    setIsConnectedState(connected);
    if (typeof window !== 'undefined') {
      localStorage.setItem('isConnected', String(connected));
    }
  }, []);

  const setActiveResource = useCallback((resource: string) => {
    setActiveResourceState(resource);
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeResource', resource);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(localStorage.getItem('apiBaseUrl') || '');
      
      const savedSchema = localStorage.getItem('apiSchema');
      if (savedSchema) setSchema(JSON.parse(savedSchema));
      
      const savedConfig = localStorage.getItem('apiSchemaConfig');
      if (savedConfig) setSchemaConfig(JSON.parse(savedConfig));
      
      const savedStudent = localStorage.getItem('student');
      if (savedStudent) setStudent(JSON.parse(savedStudent));
      
      const savedResource = localStorage.getItem('resource');
      if (savedResource) setResource(JSON.parse(savedResource));
      
      const savedEndpoints = localStorage.getItem('endpoints');
      if (savedEndpoints) setEndpoints(JSON.parse(savedEndpoints));
      
      const savedFields = localStorage.getItem('fields');
      if (savedFields) setFields(JSON.parse(savedFields));
      
      setIsConnectedState(localStorage.getItem('isConnected') === 'true');
      setActiveResourceState(localStorage.getItem('activeResource') || '');
    }
  }, []);
  const [recordCount, setRecordCount] = useState(0);
  const [lastResponseTime, setLastResponseTime] = useState(0);

  const value: ApiContextType = {
    baseUrl,
    setBaseUrl: (url) => {
      setBaseUrl(url);
      if (typeof window !== 'undefined') {
        localStorage.setItem('apiBaseUrl', url);
      }
    },
    schema,
    setSchema: (newSchema) => {
      setSchema(newSchema);
      if (typeof window !== 'undefined') {
        localStorage.setItem('apiSchema', JSON.stringify(newSchema));
      }
    },
    schemaConfig,
    setSchemaConfig: (config) => {
      setSchemaConfig(config);
      if (typeof window !== 'undefined') {
        localStorage.setItem('apiSchemaConfig', JSON.stringify(config));
      }
    },
    student,
    setStudent: (s) => {
      setStudent(s);
      if (typeof window !== 'undefined') {
        if (s) localStorage.setItem('student', JSON.stringify(s));
        else localStorage.removeItem('student');
      }
    },
    resource,
    setResource: (r) => {
      setResource(r);
      if (typeof window !== 'undefined') {
        if (r) localStorage.setItem('resource', JSON.stringify(r));
        else localStorage.removeItem('resource');
      }
    },
    endpoints,
    setEndpoints: (e) => {
      setEndpoints(e);
      if (typeof window !== 'undefined') {
        if (e) localStorage.setItem('endpoints', JSON.stringify(e));
        else localStorage.removeItem('endpoints');
      }
    },
    fields,
    setFields: (f) => {
      setFields(f);
      if (typeof window !== 'undefined') {
        localStorage.setItem('fields', JSON.stringify(f));
      }
    },
    isConnected,
    setIsConnected,
    activeResource,
    setActiveResource,
    recordCount,
    setRecordCount,
    lastResponseTime,
    setLastResponseTime,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export function useApi() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within ApiProvider');
  }
  return context;
}
