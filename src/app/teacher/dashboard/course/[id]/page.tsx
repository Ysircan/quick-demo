'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [course, setCourse] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchCourse = async () => {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/auth/course/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      console.log('🧪 返回课程数据:', data)
      if (data.success) {
        setCourse(data.course)
        setTitle(data.course.title)
        setDescription(data.course.description || '')
      }
    }
    fetchCourse()
  }, [id])

  const handleSave = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch(`/api/auth/course/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    })

    if (res.ok) {
      alert('✅ 保存成功')
    } else {
      const err = await res.json()
      alert('❌ 保存失败：' + (err.error || '未知错误'))
    }
  }

  const togglePublish = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch(`/api/auth/course/${id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })

    const data = await res.json()
    if (data.success) {
      alert(data.course.isPublished ? '✅ 发布成功' : '✅ 撤销发布成功')
      setCourse(data.course) // ✅ 更新本地状态
    } else {
      alert('❌ 发布失败：' + (data.error || '未知错误'))
    }
  }

  if (!course) return <div className="text-white p-10">加载中...</div>

  return (
    <div className="text-white p-10 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">📝 编辑课程</h1>

      <label className="block text-sm text-gray-400 mb-1">标题：</label>
      <input
        className="w-full p-2 mb-4 rounded bg-gray-800 text-white"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="课程标题"
      />

      <label className="block text-sm text-gray-400 mb-1">描述：</label>
      <textarea
        className="w-full p-2 mb-4 rounded bg-gray-800 text-white"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="课程描述"
      />

      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >保存</button>

        <button
          onClick={togglePublish}
          className={`px-4 py-2 rounded ${course.isPublished ? 'bg-red-600' : 'bg-green-600'} hover:opacity-80`}
        >
          {course.isPublished ? '撤销发布' : '发布课程'}
        </button>
      </div>
    </div>
  )
}
