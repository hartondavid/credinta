import React from 'react';

interface ProjectPost {
    id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    tags: string[];
    projectType: 'past' | 'ongoing' | 'future';
}

interface ProjectPostsDisplayProps {
    posts: ProjectPost[];
    projectType: 'past' | 'ongoing' | 'future';
    className?: string;
}

export default function ProjectPostsDisplay({ posts, projectType, className = '' }: ProjectPostsDisplayProps) {
    if (posts.length === 0) {
        return null;
    }

    const getProjectTypeColor = (type: string) => {
        switch (type) {
            case 'past': return 'bg-red-100 text-red-800';
            case 'ongoing': return 'bg-blue-100 text-blue-800';
            case 'future': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getProjectTypeLabel = (type: string) => {
        switch (type) {
            case 'past': return 'Proiect Trecut';
            case 'ongoing': return 'Proiect în Curs';
            case 'future': return 'Proiect Viitor';
            default: return 'Proiect';
        }
    };

    return (
        <section className={`py-16 bg-white ${className}`}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Postări Recente
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Urmărește ultimele noutăți și actualizări despre proiectele noastre
                    </p>
                </div>

                <div className="grid gap-8">
                    {posts.map((post) => (
                        <article key={post.id} className="bg-gray-50 rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors duration-200">
                                        {post.title}
                                    </h3>

                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                        <span className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            {post.author}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {new Date(post.createdAt).toLocaleDateString('ro-RO', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getProjectTypeColor(post.projectType)}`}>
                                            {getProjectTypeLabel(post.projectType)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="prose prose-lg max-w-none">
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    {post.content}
                                </p>
                            </div>

                            {post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-gray-200">
                                    {post.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors duration-200"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </article>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>
                            {posts.length} postări pentru {getProjectTypeLabel(projectType).toLowerCase()}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
