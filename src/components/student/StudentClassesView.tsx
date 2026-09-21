import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Play, CheckCircle2, Video, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';

export function StudentClassesView() {
  const [loading, setLoading] = useState(true);
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);
  const [pastClasses, setPastClasses] = useState<any[]>([]);

  const loadClasses = async () => {
    try {
      setLoading(true);
      const res = await api.getStudentClasses();
      setUpcomingClasses(res.upcomingClasses || []);
      setPastClasses(res.pastClasses || []);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#10182C] flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#F27C00]" />
            <span>My Live Class Schedule</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Join your live interactive cohort sessions and review past attended lessons.
          </p>
        </div>
      </div>

      {/* SECTION 1: UPCOMING LIVE CLASSES */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-[#10182C]">Upcoming Cohort Sessions</h2>

        {loading ? (
          <div className="h-32 bg-slate-200/70 rounded-2xl animate-pulse"></div>
        ) : upcomingClasses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">No upcoming classes scheduled right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingClasses.map((cls) => {
              const todayStr = new Date().toISOString().split('T')[0];
              const isToday = cls.date === todayStr;
              const liveLink = cls.effective_meeting_link || cls.meeting_link || 'https://meet.google.com';

              return (
                <div
                  key={cls.id}
                  className={`bg-white rounded-2xl border p-6 shadow-xs transition flex flex-col justify-between ${
                    isToday ? 'border-amber-400 ring-2 ring-amber-400/20 bg-gradient-to-b from-amber-50/20 to-white' : 'border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded">
                        {cls.batch_name}
                      </span>
                      {isToday && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>LIVE TODAY</span>
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-base text-[#10182C] mt-2">{cls.topic}</h3>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-600">
                      <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                        <Clock className="w-3.5 h-3.5 text-[#F27C00]" />
                        {cls.date} at {cls.start_time} IST
                      </span>
                      <span>Coach: <strong>{cls.teacher_name}</strong></span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100">
                    {cls.meeting_link && cls.meeting_link.trim() !== '' ? (
                      <a
                        href={cls.meeting_link}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full text-center py-2.5 bg-[#F27C00] text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition flex items-center justify-center gap-2 shadow-xs"
                      >
                        <Play className="w-4 h-4" />
                        <span>{isToday ? "JOIN TODAY'S LIVE CLASS" : "JOIN CLASS ROOM"}</span>
                      </a>
                    ) : (
                      <div className="w-full text-center py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold">
                        Classroom link not published yet
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* SECTION 2: PAST COMPLETED SESSIONS */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-[#10182C]">Past Attended Sessions</h2>

        {pastClasses.length > 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase">
                  <tr>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Session Topic</th>
                    <th className="py-3 px-4">Attendance</th>
                    <th className="py-3 px-4 text-right">Replay Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {pastClasses.map((sess) => (
                    <tr key={sess.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {sess.date}
                        <span className="block text-[11px] text-slate-500 font-normal">{sess.start_time}</span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#10182C] max-w-sm">
                        {sess.topic}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            sess.attendance_status === 'PRESENT'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {sess.attendance_status || 'PRESENT'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {sess.recording_url ? (
                          <a
                            href={sess.recording_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[#F27C00] font-bold hover:underline"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Watch Replay</span>
                          </a>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Processing</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
            <p className="text-xs text-slate-500">Completed classes and attendance will be archived here.</p>
          </div>
        )}
      </section>
    </div>
  );
}
