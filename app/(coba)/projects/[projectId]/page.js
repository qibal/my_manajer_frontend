"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Shadcn/card';
import { Badge } from '@/components/Shadcn/badge';
import { Progress } from '@/components/Shadcn/progress';
import projectsData from '@/data_dummy/dashboard/projects.json';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

export default function ProjectOverviewPage() {
  const params = useParams();
  const { projectId } = params;

  const project = projectsData.find(p => p.id === parseInt(projectId));

  if (!project) {
    return <div className="p-6 text-center text-xl font-semibold">Project not found.</div>;
  }

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Planning':
        return "secondary";
      case 'Research':
        return "outline";
      case 'Production':
        return "default";
      case 'Review':
        return "info";
      case 'Completed':
        return "success";
      case 'Uploaded':
        return "success";
      default:
        return "default";
    }
  };

  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case 'Low':
        return "secondary";
      case 'Medium':
        return "outline";
      case 'High':
        return "default";
      case 'Urgent':
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">Project Overview: {project.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2"><strong className="font-semibold">Description:</strong> {project.description}</p>
            <p className="mb-2"><strong className="font-semibold">Status:</strong> <Badge variant={getStatusBadgeVariant(project.status)}>{project.status}</Badge></p>
            <p className="mb-2"><strong className="font-semibold">Priority:</strong> <Badge variant={getPriorityBadgeVariant(project.priority)}>{project.priority}</Badge></p>
            <p className="mb-2"><strong className="font-semibold">Assigned To:</strong> {project.assigned_to}</p>
            <p className="mb-2"><strong className="font-semibold">Created By:</strong> {project.created_by}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timeline & Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2"><strong className="font-semibold">Start Date:</strong> {format(parseISO(project.start_date), 'PPP', { locale: id })}</p>
            <p className="mb-2"><strong className="font-semibold">Due Date:</strong> {format(parseISO(project.due_date), 'PPP', { locale: id })}</p>
            {project.completed_date && <p className="mb-2"><strong className="font-semibold">Completed Date:</strong> {format(parseISO(project.completed_date), 'PPP', { locale: id })}</p>}
            <div className="mb-2 flex items-center gap-2">
              <strong className="font-semibold">Progress:</strong>
              <Progress value={project.progress} className="w-[150px]" />
              <span>{project.progress}%</span>
            </div>
            <p className="mb-2"><strong className="font-semibold">Created At:</strong> {format(parseISO(project.created_at), 'PPP', { locale: id })}</p>
            <p className="mb-2"><strong className="font-semibold">Updated At:</strong> {format(parseISO(project.updated_at), 'PPP', { locale: id })}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financials & Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2"><strong className="font-semibold">Budget:</strong> {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(project.budget)}</p>
            <p className="mb-2"><strong className="font-semibold">Actual Cost:</strong> {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(project.actual_cost)}</p>
            <div className="mb-2"><strong className="font-semibold">Tags:</strong> 
              <div className="flex flex-wrap gap-1 mt-1">
                {project.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
            {project.custom_fields && (
              <div className="mb-2"><strong className="font-semibold">Custom Fields:</strong> 
                <pre className="whitespace-pre-wrap text-sm bg-muted p-2 rounded mt-1">{JSON.stringify(project.custom_fields, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
