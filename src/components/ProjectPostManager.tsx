import React, { useState, useEffect } from 'react';

interface ProjectPost {
    id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    updatedAt: string;
    projectType: 'past' | 'ongoing' | 'future';
    projectId?: string;
    tags: string[];
    images?: string[];
    status: 'draft' | 'published' | 'archived';
}

interface ProjectPostManagerProps {
    className?: string;
}

export default function ProjectPostManager({ className = '' }: ProjectPostManagerProps) {
    const [posts, setPosts] = useState<ProjectPost[]>([]);
    const [newPost, setNewPost] = useState<Partial<ProjectPost>>({
        title: '',
        content: '',
        author: '',
        projectType: 'ongoing',
        tags: [],
        status: 'draft'
    });
    const [isAddingPost, setIsAddingPost] = useState(false);
    const [filterType, setFilterType] = useState<'all' | 'past' | 'ongoing' | 'future'>('all');
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });

    // Load posts from localStorage on component mount
    useEffect(() => {
        const savedPosts = localStorage.getItem('projectPosts');
        if (savedPosts) {
            setPosts(JSON.parse(savedPosts));
        }
    }, []);

    // Save posts to localStorage whenever posts change
    useEffect(() => {
        localStorage.setItem('projectPosts', JSON.stringify(posts));
    }, [posts]);

    const handleAddPost = () => {
        if (!newPost.title || !newPost.content || !newPost.author) {
            alert('Vă rugăm să completați toate câmpurile obligatorii.');
            return;
        }

        const post: ProjectPost = {
            id: `post-${Date.now()}`,
            title: newPost.title!,
            content: newPost.content!,
            author: newPost.author!,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            projectType: newPost.projectType!,
            projectId: newPost.projectId,
            tags: newPost.tags || [],
            images: newPost.images || [],
            status: newPost.status!
        };

        setPosts(prev => [post, ...prev]);
        setNewPost({
            title: '',
            content: '',
            author: '',
            projectType: 'ongoing',
            tags: [],
            status: 'draft'
        });
        setIsAddingPost(false);
    };

    const handleDeletePost = (postId: string) => {
        if (confirm('Sigur doriți să ștergeți acest post?')) {
            setPosts(prev => prev.filter(post => post.id !== postId));
        }
    };

    const handleUpdatePostStatus = (postId: string, newStatus: ProjectPost['status']) => {
        setPosts(prev => prev.map(post =>
            post.id === postId
                ? { ...post, status: newStatus, updatedAt: new Date().toISOString() }
                : post
        ));
    };

    const filteredPosts = posts.filter(post => {
        if (filterType !== 'all' && post.projectType !== filterType) return false;

        if (dateRange.startDate && dateRange.endDate) {
            const postDate = new Date(post.createdAt);
            const startDate = new Date(dateRange.startDate);
            const endDate = new Date(dateRange.endDate);
            return postDate >= startDate && postDate <= endDate;
        }

        return true;
    });

    const addTag = (tag: string) => {
        if (tag && !newPost.tags?.includes(tag)) {
            setNewPost(prev => ({
                ...prev,
                tags: [...(prev.tags || []), tag]
            }));
        }
    };

    const removeTag = (tagToRemove: string) => {
        setNewPost(prev => ({
            ...prev,
            tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
        }));
    };

    return (
        <div className={`${className} space-y-6`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-2">Gestionare Posturi Proiecte</h2>
                <p className="text-blue-100">
                    Adaugă și gestionează posturile pentru proiectele trecute, curente și viitoare
                </p>
            </div>

            {/* Add New Post Button */}
            <div className="text-center">
                <button
                    onClick={() => setIsAddingPost(!isAddingPost)}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                    {isAddingPost ? 'Anulează' : 'Adaugă Post Nou'}
                </button>
            </div>

            {/* Add New Post Form */}
            {isAddingPost && (
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Post Nou</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Titlu *
                            </label>
                            <input
                                type="text"
                                value={newPost.title}
                                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Introduceți titlul postului"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Autor *
                            </label>
                            <input
                                type="text"
                                value={newPost.author}
                                onChange={(e) => setNewPost(prev => ({ ...prev, author: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Numele autorului"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tip Proiect *
                            </label>
                            <select
                                value={newPost.projectType}
                                onChange={(e) => setNewPost(prev => ({ ...prev, projectType: e.target.value as any }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="past">Proiecte Trecute</option>
                                <option value="current">Proiecte în Curs</option>
                                <option value="future">Proiecte Viitoare</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={newPost.status}
                                onChange={(e) => setNewPost(prev => ({ ...prev, status: e.target.value as any }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="draft">Ciornă</option>
                                <option value="published">Publicat</option>
                                <option value="archived">Arhivat</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Conținut *
                        </label>
                        <textarea
                            value={newPost.content}
                            onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Scrieți conținutul postului..."
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tag-uri
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {newPost.tags?.map(tag => (
                                <span
                                    key={tag}
                                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                                >
                                    {tag}
                                    <button
                                        onClick={() => removeTag(tag)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Adaugă tag"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        const target = e.target as HTMLInputElement;
                                        addTag(target.value);
                                        target.value = '';
                                    }
                                }}
                            />
                            <button
                                onClick={() => {
                                    const input = document.querySelector('input[placeholder="Adaugă tag"]') as HTMLInputElement;
                                    if (input.value) {
                                        addTag(input.value);
                                        input.value = '';
                                    }
                                }}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                            >
                                Adaugă
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleAddPost}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
                        >
                            Salvează Post
                        </button>
                        <button
                            onClick={() => setIsAddingPost(false)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
                        >
                            Anulează
                        </button>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filtrează după tip
                        </label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as any)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Toate tipurile</option>
                            <option value="past">Proiecte Trecute</option>
                            <option value="current">Proiecte în Curs</option>
                            <option value="future">Proiecte Viitoare</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Data de început
                        </label>
                        <input
                            type="date"
                            value={dateRange.startDate}
                            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Data de sfârșit
                        </label>
                        <input
                            type="date"
                            value={dateRange.endDate}
                            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">
                    Posturi ({filteredPosts.length})
                </h3>

                {filteredPosts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        Nu există posturi care să corespundă filtrelor selectate.
                    </div>
                ) : (
                    filteredPosts.map(post => (
                        <div key={post.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 mb-1">{post.title}</h4>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <span>de {post.author}</span>
                                        <span>•</span>
                                        <span>{new Date(post.createdAt).toLocaleDateString('ro-RO')}</span>
                                        <span>•</span>
                                        <span className={`px-2 py-1 rounded-full text-xs ${post.projectType === 'past' ? 'bg-red-100 text-red-800' :
                                            post.projectType === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                            {post.projectType === 'past' ? 'Trecut' :
                                                post.projectType === 'ongoing' ? 'În Curs' : 'Viitor'}
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs ${post.status === 'published' ? 'bg-green-100 text-green-800' :
                                            post.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {post.status === 'published' ? 'Publicat' :
                                                post.status === 'draft' ? 'Ciornă' : 'Arhivat'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-3 md:mt-0">
                                    <select
                                        value={post.status}
                                        onChange={(e) => handleUpdatePostStatus(post.id, e.target.value as any)}
                                        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="draft">Ciornă</option>
                                        <option value="published">Publicat</option>
                                        <option value="archived">Arhivat</option>
                                    </select>

                                    <button
                                        onClick={() => handleDeletePost(post.id)}
                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200"
                                    >
                                        Șterge
                                    </button>
                                </div>
                            </div>

                            <p className="text-gray-700 mb-3 line-clamp-3">{post.content}</p>

                            {post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map(tag => (
                                        <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
